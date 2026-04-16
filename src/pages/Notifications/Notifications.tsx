import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import styles from "./Notifications.module.css";
import { useNavigate } from "react-router-dom";

import {
  getNotifications,
  markNotificationsAsRead
} from "../../api/caseApi";

function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res.data);

        // 👇 markera som lästa direkt när sidan öppnas
        await markNotificationsAsRead();
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Notifikationer</h1>

        {notifications.length === 0 ? (
          <p className={styles.empty}>Inga notifikationer</p>
        ) : (
          <div className={styles.list}>
            {notifications.map((n) => (
              <div
                key={n.id}
                className={styles.card}
                onClick={() => navigate(`/cases/${n.caseId}`)}
              >
                <p className={styles.message}>{n.message}</p>

                <span className={styles.date}>
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Notifications;