import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import Layout from "../../components/layout/Layout";
import styles from "./Dashboard.module.css";

function Dashboard() {
const { token, role } = useAuth();
const [data, setData] = useState<any>(null);


useEffect(() => {
  fetch("http://localhost:8080/cases/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(setData);
}, [token]);

if (!data) return <Layout><p>Laddar...</p></Layout>;

return (
  <Layout>
    <div className={styles.dashboard}>

      <h2>Dashboard</h2>

      {role === "MANAGER" && (
        <div>
          <h3>Admins statistik</h3>
          {data.admins?.map((admin: any) => (
            <div key={admin.userId}>
              <p>Admin ID: {admin.userId}</p>
              <p>Ärenden: {admin.totalCases}</p>
            </div>
          ))}
        </div>
      )}

      {role === "ADMIN" && (
        <div>
          <h3>Min statistik</h3>
          <p>Ärenden: {data.totalCases}</p>
        </div>
      )}

    </div>
  </Layout>
);
}

export default Dashboard;