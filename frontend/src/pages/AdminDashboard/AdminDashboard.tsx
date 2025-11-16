import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { adminApi, DashboardStats } from '../../services/api/adminApi';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button/Button';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './AdminDashboard.module.css';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await adminApi.getDashboard();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.loading}>{t('common.loading')}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.dashboard}>
        <h1 className={styles.title}>{t('pages.admin.dashboard.title')}</h1>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>{t('pages.admin.dashboard.totalResults')}</h3>
            <p className={styles.statValue}>{stats?.totalResults || 0}</p>
          </div>
          <div className={styles.statCard}>
            <h3>{t('pages.admin.dashboard.totalVillages')}</h3>
            <p className={styles.statValue}>{stats?.totalVillages || 0}</p>
          </div>
          <div className={styles.statCard}>
            <h3>{t('pages.admin.dashboard.totalStandards')}</h3>
            <p className={styles.statValue}>{stats?.totalStandards || 0}</p>
          </div>
        </div>

        {stats && (
          <div className={styles.charts}>
            {stats.resultsByMedium && stats.resultsByMedium.length > 0 && (
              <div className={styles.chartCard}>
                <h3>Results by Medium</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.resultsByMedium.map((item: any) => ({
                        name: item._id === 'gujarati' ? 'Gujarati' : 'English',
                        value: item.count,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.resultsByMedium.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#4caf50' : '#2196f3'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {stats.resultsByStandard && stats.resultsByStandard.length > 0 && (
              <div className={styles.chartCard}>
                <h3>Results by Standard</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.resultsByStandard.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="standardName" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#4caf50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {stats?.recentResults && stats.recentResults.length > 0 && (
          <div className={styles.recentResults}>
            <h3>Recent Submissions</h3>
            <div className={styles.recentList}>
              {stats.recentResults.slice(0, 5).map((result: any) => (
                <div key={result._id} className={styles.recentItem}>
                  <span>{result.studentName}</span>
                  <span>{result.percentage.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <Button variant="primary" onClick={() => navigate('/admin/manage-villages')}>
            {t('navigation.manageVillages')}
          </Button>
          <Button variant="primary" onClick={() => navigate('/admin/manage-standards')}>
            {t('navigation.manageStandards')}
          </Button>
          <Button variant="primary" onClick={() => navigate('/admin/view-reports')}>
            {t('navigation.viewReports')}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

