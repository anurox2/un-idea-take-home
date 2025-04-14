import { createContext, useState, useEffect, useRef } from "react";
import { fetchUsers, fetchProjects } from "./apiCalls";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const itemsPerPage = 10;

  const initialUsersFetchDone = useRef(false);
  const initialProjectsFetchDone = useRef(false);

  // This useEffect fetches data for users
  useEffect(() => {
    if (initialUsersFetchDone.current && currentPage === 1) return;

    const fetchUsersData = async () => {
      try {
        setUsersLoading(true);
        const skip = (currentPage - 1) * itemsPerPage;
        const usersData = await fetchUsers(skip, itemsPerPage);
        if (usersData) {
          setUsers(usersData.users);
          setTotalUsers(usersData.total);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsersData();
    if (currentPage === 1) initialUsersFetchDone.current = true;
  }, [currentPage]);

  // This useEffect fetches data for projects
  useEffect(() => {
    if (initialProjectsFetchDone.current && currentProjectPage === 1) return;

    const fetchProjectsData = async () => {
      try {
        setProjectsLoading(true);
        const skip = (currentProjectPage - 1) * itemsPerPage;
        const projectsData = await fetchProjects(skip, itemsPerPage);
        if (projectsData) {
          setProjects(projectsData.products);
          setTotalProjects(projectsData.total);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjectsData();
    if (currentProjectPage === 1) initialProjectsFetchDone.current = true;
  }, [currentProjectPage]);

  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const totalProjectPages = Math.ceil(totalProjects / itemsPerPage);

  return (
    <ApiContext.Provider
      value={{
        users,
        projects,
        usersLoading,
        projectsLoading,
        currentPage,
        currentProjectPage,
        totalPages,
        totalProjectPages,
        setCurrentPage,
        setCurrentProjectPage,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContext;
