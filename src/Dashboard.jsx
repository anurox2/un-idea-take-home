import { useEffect, useState, useContext, useRef } from "react";
import ApiContext from "./ContextStore";
import PaginationControls from "./components/PaginationControls";
import { exportPerformanceDataToCSV } from "./utils/exportUtils";
import "./dashboard.css";

const Dashboard = () => {
  // Getting the context values
  const {
    users: cachedUsers,
    projects: cachedProjects,
    usersLoading,
    projectsLoading,
    currentPage,
    currentProjectPage,
    totalPages,
    totalProjectPages,
    setCurrentPage,
    setCurrentProjectPage,
  } = useContext(ApiContext);

  // State variables for fetching data directly from the API
  const [directUsers, setDirectUsers] = useState([]);
  const [directProjects, setDirectProjects] = useState([]);
  const [directLoading, setDirectLoading] = useState(true);
  const [directFetchTime, setDirectFetchTime] = useState(0);
  const [contextFetchTime, setContextFetchTime] = useState(0);
  const [performanceData, setPerformanceData] = useState([]);
  const initialFetchDone = useRef(false);
  const contextTimingRef = useRef(null);

  // This useEffect measures the fetch time for cached data
  useEffect(() => {
    if (!contextTimingRef.current) {
      contextTimingRef.current = performance.now();
    }

    if (!usersLoading && !projectsLoading) {
      const contextTime = performance.now() - contextTimingRef.current;
      setContextFetchTime(contextTime);
      contextTimingRef.current = null;

      setPerformanceData((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          method: "Context API",
          fetchTime: contextTime,
          usersCount: cachedUsers.length,
          projectsCount: cachedProjects.length,
        },
      ]);
    }
  }, [usersLoading, projectsLoading]);

  // This function fetches the data directly from the API without any optimizations
  const fetchDirectData = async () => {
    setDirectLoading(true);
    const startTime = performance.now();
    const usersBaseURL = new URL("https://dummyjson.com/users");
    const productsBaseURL = new URL("https://dummyjson.com/products");
    const usersUrlSearchParams = new URLSearchParams({ limit: 0 });
    usersBaseURL.search = usersUrlSearchParams.toString();
    productsBaseURL.search = usersUrlSearchParams.toString();

    try {
      const [usersData, projectsData] = await Promise.all([
        fetch(usersBaseURL).then((res) => res.json()),
        fetch(productsBaseURL).then((res) => res.json()),
      ]);

      setDirectUsers(usersData.users);
      setDirectProjects(projectsData.products);
      const endTime = performance.now();
      setDirectFetchTime(endTime - startTime);

      setPerformanceData((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          method: "Direct API",
          fetchTime: endTime - startTime,
          usersCount: usersData.users.length,
          projectsCount: projectsData.products.length,
        },
      ]);
    } catch (error) {
      console.error("Error fetching direct data:", error);
    } finally {
      setDirectLoading(false);
    }
  };

  // This useEffect fetches data directly from the API
  useEffect(() => {
    if (initialFetchDone.current) return;
    fetchDirectData();
    initialFetchDone.current = true;
  }, []);

  /* Following functions handle the pagination for users and projects */
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevProjectPage = () => {
    setCurrentProjectPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextProjectPage = () => {
    setCurrentProjectPage((prev) => Math.min(prev + 1, totalProjectPages));
  };

  return (
    <div className="main-container">
      <div className="performance-controls">
        <button
          onClick={() => exportPerformanceDataToCSV(performanceData)}
          className="export-button"
          disabled={performanceData.length === 0}
        >
          Export Performance Data
        </button>
        <div className="performance-summary">Total measurements: {performanceData.length}</div>
      </div>

      <div className="width-45">
        <h2 className="margin-bottom-1">Cached Data (Context)</h2>
        <div className="fetch-time">Fetch time: {contextFetchTime.toFixed(2)}ms</div>

        <h3>Users</h3>
        {usersLoading && <p>Loading users...</p>}
        {!usersLoading && cachedUsers.length === 0 && <p>No users available</p>}
        {!usersLoading && cachedUsers.map((user) => <div key={user.id}>{user.firstName}</div>)}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          isLoading={usersLoading}
        />

        <h3>Projects</h3>
        {projectsLoading && <p>Loading projects...</p>}
        {!projectsLoading && cachedProjects.length === 0 && <p>No projects available</p>}
        {!projectsLoading &&
          cachedProjects.map((project) => <div key={project.id}>{project.sku}</div>)}

        <PaginationControls
          currentPage={currentProjectPage}
          totalPages={totalProjectPages}
          onPrevPage={handlePrevProjectPage}
          onNextPage={handleNextProjectPage}
          isLoading={projectsLoading}
        />
      </div>

      <div className="width-45">
        <div className="section-header">
          <h2>Direct API Calls</h2>
          <button onClick={fetchDirectData} className="refresh-button" disabled={directLoading}>
            {directLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <div className="fetch-time">Fetch time: {directFetchTime.toFixed(2)}ms</div>
        {directLoading && <p>Loading direct data...</p>}
        <h3>Users</h3>
        <ol>
          {directUsers.map((user) => (
            <li key={user.id}>{user.firstName}</li>
          ))}
        </ol>
        <h3>Projects</h3>
        <ol>
          {directProjects.map((project) => (
            <li key={project.id}>{project.sku}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Dashboard;
