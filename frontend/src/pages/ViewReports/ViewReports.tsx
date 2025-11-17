import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { reportApi } from '../../services/api/reportApi';
import { villageApi } from '../../services/api/villageApi';
import { standardApi } from '../../services/api/standardApi';
import { Village, Standard } from '../../types/result.types';
import Layout from '../../components/layout/Layout';
import Select from '../../components/common/Select/Select';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { saveAs } from 'file-saver';
import styles from './ViewReports.module.css';

const ViewReports: React.FC = () => {
  const { t } = useTranslation();
  const [villages, setVillages] = useState<Village[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [filters, setFilters] = useState({
    medium: '',
    standardId: '',
    villageId: '',
    isVerified: '',
  });
  const [summary, setSummary] = useState<any>(null);
  const [byMediumData, setByMediumData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'gujarati' | 'english'>('all');

  useEffect(() => {
    loadData();
    loadSummary();
  }, []);

  useEffect(() => {
    loadSummary();
    loadByMedium();
  }, [filters]);

  const loadData = async () => {
    try {
      const [villagesData, standardsData] = await Promise.all([
        villageApi.getAll(),
        standardApi.getAll(),
      ]);
      setVillages(villagesData);
      setStandards(standardsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadSummary = async () => {
    setIsLoading(true);
    try {
      const data = await reportApi.getSummary({
        medium: filters.medium || undefined,
        standardId: filters.standardId || undefined,
        villageId: filters.villageId || undefined,
      });
      setSummary(data);
    } catch (error) {
      console.error('Error loading summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadByMedium = async () => {
    try {
      const data = await reportApi.getByMedium({
        standardId: filters.standardId || undefined,
        villageId: filters.villageId || undefined,
      });
      setByMediumData(data);
    } catch (error) {
      console.error('Error loading by medium:', error);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      const blob = await reportApi.exportReport(format, {
        medium: filters.medium || undefined,
        standardId: filters.standardId || undefined,
        villageId: filters.villageId || undefined,
      });
      saveAs(blob, `report.${format === 'pdf' ? 'pdf' : 'xlsx'}`);
    } catch (error) {
      alert('Error exporting report');
    }
  };

  return (
    <Layout>
      <div className={styles.viewReports}>
        <h1 className={styles.title}>{t('navigation.viewReports')}</h1>

        <div className={styles.filters}>
          <Select
            label={t('pages.results.filterByMedium')}
            options={[
              { value: '', label: t('pages.results.all') },
              { value: 'gujarati', label: t('forms.gujarati') },
              { value: 'english', label: t('forms.english') },
            ]}
            value={filters.medium}
            onChange={(e) => setFilters({ ...filters, medium: e.target.value })}
          />

          <Select
            label={t('pages.results.filterByStandard')}
            options={[
              { value: '', label: t('pages.results.all') },
              ...standards.map((s) => ({
                value: s._id,
                label: s.standardName,
              })),
            ]}
            value={filters.standardId}
            onChange={(e) => setFilters({ ...filters, standardId: e.target.value })}
          />

          <Select
            label={t('pages.results.filterByVillage')}
            options={[
              { value: '', label: t('pages.results.all') },
              ...villages.map((v) => ({
                value: v._id,
                label: v.villageName,
              })),
            ]}
            value={filters.villageId}
            onChange={(e) => setFilters({ ...filters, villageId: e.target.value })}
          />

          <Select
            label="Verification Status"
            options={[
              { value: '', label: 'All' },
              { value: 'true', label: 'Verified' },
              { value: 'false', label: 'Not Verified' },
            ]}
            value={filters.isVerified}
            onChange={(e) => setFilters({ ...filters, isVerified: e.target.value })}
          />

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="success" onClick={() => handleExport('excel')}>
              {t('common.export')} Excel
            </Button>
            <Button variant="success" onClick={() => handleExport('pdf')}>
              {t('common.export')} PDF
            </Button>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={activeTab === 'all' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={activeTab === 'gujarati' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('gujarati')}
          >
            Gujarati Medium
          </button>
          <button
            className={activeTab === 'english' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('english')}
          >
            English Medium
          </button>
        </div>

        {isLoading ? (
          <div className={styles.loading}>{t('common.loading')}</div>
        ) : (
          <>
            {activeTab === 'all' && summary && (
              <div className={styles.summary}>
                <h2>Summary Statistics</h2>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <h3>Total Results</h3>
                    <p>{summary.summary?.total || 0}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Average Percentage</h3>
                    <p>{(summary.summary?.averagePercentage || 0).toFixed(2)}%</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Max Percentage</h3>
                    <p>{(summary.summary?.maxPercentage || 0).toFixed(2)}%</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Min Percentage</h3>
                    <p>{(summary.summary?.minPercentage || 0).toFixed(2)}%</p>
                  </div>
                </div>

                {summary.byMedium && summary.byMedium.length > 0 && (
                  <div className={styles.chartSection}>
                    <h3>Results by Medium</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={summary.byMedium.map((item: any) => ({
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
                          {summary.byMedium.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#4caf50' : '#2196f3'} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'gujarati' && byMediumData?.gujarati && (
              <div className={styles.mediumSection}>
                <h2>Gujarati Medium Results</h2>
                <div className={styles.mediumStats}>
                  <div className={styles.statCard}>
                    <h3>Total Results</h3>
                    <p>{byMediumData.gujarati.length}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Average Percentage</h3>
                    <p>
                      {(
                        byMediumData.gujarati.reduce((sum: number, r: any) => sum + r.percentage, 0) /
                        byMediumData.gujarati.length || 0
                      ).toFixed(2)}%
                    </p>
                  </div>
                </div>
                <div className={styles.chartSection}>
                  <h3>Percentage Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={byMediumData.gujarati.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="studentName" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="percentage" fill="#4caf50" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'english' && byMediumData?.english && (
              <div className={styles.mediumSection}>
                <h2>English Medium Results</h2>
                <div className={styles.mediumStats}>
                  <div className={styles.statCard}>
                    <h3>Total Results</h3>
                    <p>{byMediumData.english.length}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Average Percentage</h3>
                    <p>
                      {(
                        byMediumData.english.reduce((sum: number, r: any) => sum + r.percentage, 0) /
                        byMediumData.english.length || 0
                      ).toFixed(2)}%
                    </p>
                  </div>
                </div>
                <div className={styles.chartSection}>
                  <h3>Percentage Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={byMediumData.english.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="studentName" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="percentage" fill="#2196f3" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ViewReports;

