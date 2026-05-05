import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import styles from "./Notifications.module.css";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  getNotifications,
  markNotificationsAsRead,
  deleteNotification
} from "../../api/caseApi";

function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /**
   * Hämtar notifikationer
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await getNotifications();
        setNotifications(res || []);

        await markNotificationsAsRead();
      } catch (err) {
        console.error(err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Delete modal
   */
  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;

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

  /**
   * Skeleton loader
   */
  const NotificationsSkeleton = () => {
    return (
      <div className={styles.list}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.card}>
            <Skeleton width="80%" height={20} />
            <Skeleton width={120} height={15} style={{ marginTop: 8 }} />
            <Skeleton circle width={30} height={30} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Notifikationer</h1>

          {loading ? (
            <NotificationsSkeleton />
          ) : notifications.length === 0 ? (
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
                <p>Är du säker på att du vill ta bort denna notifikation?</p>

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