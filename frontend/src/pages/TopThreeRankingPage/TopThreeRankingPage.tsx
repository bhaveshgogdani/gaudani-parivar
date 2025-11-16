import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { reportApi } from '../../services/api/reportApi';
import { resultApi } from '../../services/api/resultApi';
import { standardApi } from '../../services/api/standardApi';
import { Standard } from '../../types/result.types';
import Layout from '../../components/layout/Layout';
import Select from '../../components/common/Select/Select';
import Button from '../../components/common/Button/Button';
import { saveAs } from 'file-saver';
import styles from './TopThreeRankingPage.module.css';

const TopThreeRankingPage: React.FC = () => {
  const { t } = useTranslation();
  const [standards, setStandards] = useState<Standard[]>([]);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [topThree, setTopThree] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isAdmin = localStorage.getItem('adminToken');

  useEffect(() => {
    loadStandards();
  }, []);

  const loadStandards = async () => {
    try {
      const data = await standardApi.getAll();
      setStandards(data);
    } catch (error) {
      console.error('Error loading standards:', error);
    }
  };

  const loadTopThree = async (standardId?: string) => {
    setIsLoading(true);
    try {
      const data = await reportApi.getTopThree(standardId);
      setTopThree(data);
    } catch (error) {
      console.error('Error loading top three:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      const blob = await reportApi.exportTopThreeDocx();
      saveAs(blob, 'top-three-ranking.docx');
    } catch (error) {
      alert('Error downloading file');
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    if (confirm('Are you sure you want to delete this result?')) {
      try {
        await resultApi.delete(id);
        loadTopThree(selectedStandard || undefined);
      } catch (error) {
        alert('Error deleting result');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout showHeader={false}>
      <div className={styles.topThreePage}>
        <h1 className={styles.title}>{t('pages.topThree.title')}</h1>

        <div className={styles.controls}>
          <Select
            label={t('pages.topThree.selectStandard')}
            options={[
              { value: '', label: t('pages.results.all') },
              ...standards.map((s) => ({
                value: s._id,
                label: s.standardName,
              })),
            ]}
            value={selectedStandard}
            onChange={(e) => setSelectedStandard(e.target.value)}
          />

          <div className={styles.actions}>
            <Button
              variant="primary"
              onClick={() => loadTopThree(selectedStandard || undefined)}
              isLoading={isLoading}
            >
              {t('pages.topThree.clickHere')}
            </Button>
            <Button variant="secondary" onClick={() => loadTopThree()}>
              {t('pages.topThree.viewAll')}
            </Button>
            <Button variant="success" onClick={handleDownloadDocx}>
              {t('pages.topThree.downloadDocx')}
            </Button>
          </div>
        </div>

        <div className={styles.topTableContainer}>
          <h2 className={styles.topTableTitle}>Top 3 List</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('pages.results.srNo')}</th>
                <th>{t('pages.results.studentName')}</th>
                <th>{t('pages.results.standard')}</th>
                <th>{t('pages.results.percentage')}</th>
                <th>{t('pages.results.village')}</th>
                <th>{t('pages.results.contact')}</th>
                {isAdmin && <th>{t('common.actions')}</th>}
              </tr>
            </thead>
            <tbody>
              {topThree.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className={styles.emptyCell}>
                    {t('tables.noData')}
                  </td>
                </tr>
              ) : (
                topThree.flatMap((group: any) =>
                  group.topThree?.map((result: any, index: number) => (
                    <tr key={result._id}>
                      <td>{index + 1}</td>
                      <td>{result.studentName}</td>
                      <td>{result.standardId?.standardName || '-'}</td>
                      <td>{result.percentage.toFixed(2)}%</td>
                      <td>{result.villageId?.villageName || '-'}</td>
                      <td>{result.contactNumber || '-'}</td>
                      {isAdmin && (
                        <td>
                          <Button
                            variant="danger"
                            size="small"
                            onClick={() => handleDelete(result._id)}
                          >
                            {t('common.delete')}
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>

        {topThree.length > 0 && (
          <div className={styles.results}>
            <h2 className={styles.sectionTitle}>Results Grouped by Standard</h2>
            {topThree.map((group: any) => (
              <div key={group._id?._id || 'unknown'} className={styles.group}>
                <h2 className={styles.groupTitle}>
                  {group._id?.standardName || 'Unknown Standard'}
                </h2>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t('pages.results.srNo')}</th>
                      <th>{t('pages.results.studentName')}</th>
                      <th>{t('pages.results.percentage')}</th>
                      <th>{t('pages.results.village')}</th>
                      <th>{t('pages.results.contact')}</th>
                      {isAdmin && <th>{t('common.actions')}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {group.topThree?.map((result: any, index: number) => (
                      <tr key={result._id}>
                        <td>{index + 1}</td>
                        <td>{result.studentName}</td>
                        <td>{result.percentage.toFixed(2)}%</td>
                        <td>{result.villageId?.villageName || '-'}</td>
                        <td>{result.contactNumber || '-'}</td>
                        {isAdmin && (
                          <td>
                            <Button
                              variant="danger"
                              size="small"
                              onClick={() => handleDelete(result._id)}
                            >
                              {t('common.delete')}
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {topThree.length > 0 && (
          <div className={styles.printActions}>
            <Button variant="secondary" onClick={handlePrint}>
              {t('common.print')}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TopThreeRankingPage;

