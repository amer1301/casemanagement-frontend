import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import styles from "./Notifications.module.css";
import { useNavigate } from "react-router-dom";

import {
  getNotifications,
  markNotificationsAsRead,
  deleteNotification
} from "../../api/caseApi";

function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res);

        await markNotificationsAsRead();
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    console.log("Deleting notification with ID:", selectedId);

    try {
      await deleteNotification(selectedId);

      setNotifications((prev) =>
        prev.filter((n) => n.id !== selectedId)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setShowDeleteModal(false);
      setSelectedId(null);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
              <main className={styles.main}>
        <h1 className={styles.title}>Notifikationer</h1>

        {notifications?.length === 0 ? (
          <p className={styles.empty}>Inga notifikationer</p>
        ) : (
          <div className={styles.list}>
            {notifications?.map((n) => (
              <div
                key={n.id}
                className={styles.card}
                onClick={() => navigate(`/cases/${n.caseId}`)}
              >
                <p className={styles.message}>{n.message}</p>

                <span className={styles.date}>
                  {new Date(n.createdAt).toLocaleString()}
                </span>

                <button
                  className={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(n.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {showDeleteModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Bekräfta borttagning</h3>
              <p>
                Är du säker på att du vill ta bort denna notifikation?
              </p>

              <div className={styles.modalActions}>
                <button onClick={() => setShowDeleteModal(false)}>
                  Avbryt
                </button>

                <button
                  className={styles.deleteConfirm}
                  onClick={handleDelete}
                >
                  Ja, ta bort
                </button>
              </div>
            </div>
          </div>
        )}
</main>
      </div>
    </Layout>
  );
}

export default Notifications;