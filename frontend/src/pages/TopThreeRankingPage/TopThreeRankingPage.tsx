import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { useToast } from '../../context/ToastContext';
import { reportApi } from '../../services/api/reportApi';
import { resultApi } from '../../services/api/resultApi';
import { standardApi } from '../../services/api/standardApi';
import { Standard } from '../../types/result.types';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button/Button';
import { saveAs } from 'file-saver';
import styles from './TopThreeRankingPage.module.css';
import { useNavigate } from 'react-router-dom';

const TopThreeRankingPage: React.FC = () => {
  const { t } = useTranslation();
  const { showError } = useToast();
  const [standards, setStandards] = useState<Standard[]>([]);
  const [gujaratiResults, setGujaratiResults] = useState<any[]>([]);
  const [englishResults, setEnglishResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'gujarati' | 'english'>('gujarati');
  const [fullImageUrl, setFullImageUrl] = useState<string | null>(null);
  const isAdmin = localStorage.getItem('adminToken');
  const navigate = useNavigate();

  useEffect(() => {
    loadStandards();
    loadTopThree();
  }, []);

  const loadStandards = async () => {
    try {
      const data = await standardApi.getAll();
      // Filter only school level standards
      const schoolStandards = data.filter((s) => !s.isCollegeLevel);
      setStandards(schoolStandards);
    } catch (error) {
      console.error('Error loading standards:', error);
    }
  };

  const loadTopThree = async () => {
    setIsLoading(true);
    try {
      const [gujaratiData, englishData] = await Promise.all([
        reportApi.getTopThree(undefined, 'gujarati'),
        reportApi.getTopThree(undefined, 'english'),
      ]);
      
      // Group by standard
      const gujaratiGrouped = groupByStandard(gujaratiData);
      const englishGrouped = groupByStandard(englishData);
      
      setGujaratiResults(gujaratiGrouped);
      setEnglishResults(englishGrouped);
    } catch (error) {
      console.error('Error loading top three:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupByStandard = (data: any[]) => {
    if (!data || data.length === 0) {
      // Return all standards with empty results
      return standards.map((standard) => ({
        standardId: standard._id,
        standardName: standard.standardName,
        results: [],
      }));
    }
    
    const grouped: { [key: string]: any } = {};
    
    data.forEach((group: any) => {
      // Handle different possible data structures
      const standardId = group._id?.standardId?._id || group._id?.standardId || group.standardId;
      const standardName = group._id?.standardId?.standardName || group.standardName || 'Unknown';
      
      if (standardId) {
        const standardIdStr = standardId.toString ? standardId.toString() : standardId;
        if (!grouped[standardIdStr]) {
          grouped[standardIdStr] = {
            standardId: standardIdStr,
            standardName,
            results: [],
          };
        }
        
        // Add results from this group
        if (group.topThree && Array.isArray(group.topThree)) {
          grouped[standardIdStr].results = [...grouped[standardIdStr].results, ...group.topThree];
        }
      }
    });
    
    // Ensure all standards are included, even if they have no results
    const allStandardsMap = new Map(
      standards.map((s) => [s._id.toString(), {
        standardId: s._id.toString(),
        standardName: s.standardName,
        results: grouped[s._id.toString()]?.results || [],
      }])
    );
    
    // Merge with existing grouped data
    Object.values(grouped).forEach((group: any) => {
      allStandardsMap.set(group.standardId, group);
    });
    
    // Sort by standard display order
    return Array.from(allStandardsMap.values()).sort((a: any, b: any) => {
      const standardA = standards.find((s) => s._id === a.standardId);
      const standardB = standards.find((s) => s._id === b.standardId);
      return (standardA?.displayOrder || 0) - (standardB?.displayOrder || 0);
    });
  };

  const handleDownloadPdf = async () => {
    try {
      const blob = await reportApi.exportTopThreePdf(activeTab);
      saveAs(blob, 'top-three-ranking-'+activeTab+'.pdf');
    } catch (error) {
      showError('Error downloading PDF');
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    if (confirm('Are you sure you want to delete this result?')) {
      try {
        await resultApi.delete(id);
        loadTopThree();
      } catch (error) {
        showError('Error deleting result');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentResults = activeTab === 'gujarati' ? gujaratiResults : englishResults;

  const handleImageClick = (imageUrl: string) => {
    if (imageUrl) {
      setFullImageUrl(imageUrl);
    }
  };

  const handleEditClick = (id: string) => {
    navigate(`/admin/manage-results?resultId=${id}`);
  };

  const getImageUrl = (result: any) => {
    if (result.resultImageUrl) {
      return result.resultImageUrl;
    }
    return '';
  };

  return (
    <Layout>
      <div className={styles.topThreePage}>
        <h1 className={styles.title}>{t('pages.topThree.title')}</h1>

        <div className={styles.tabs}>
          <button
            className={activeTab === 'gujarati' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('gujarati')}
          >
            {t('forms.gujarati')} {t('forms.medium')}
          </button>
          <button
            className={activeTab === 'english' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('english')}
          >
            {t('forms.english')} {t('forms.medium')}
          </button>
        </div>

          <div className={styles.actions}>
          <Button variant="primary" onClick={handleDownloadPdf}>
            {t('pages.topThree.downloadPdf')}
            </Button>
          <Button variant="secondary" onClick={handlePrint}>
            {t('common.print')}
            </Button>
        </div>

        {isLoading ? (
          <div className={styles.loading}>{t('common.loading')}</div>
        ) : (
          <div className={styles.results}>
            {currentResults.length === 0 ? (
              <div className={styles.noData}>{t('tables.noData')}</div>
            ) : (
              currentResults.map((group: any) => (
                <div key={group.standardId} className={styles.group}>
                  <h2 className={styles.groupTitle}>
                    {group.standardName}
                  </h2>
          <table className={styles.table}>
            <thead>
              <tr>
                        <th>Rank</th>
                <th>{t('pages.results.studentName')}</th>
                <th>{t('pages.results.percentage')}</th>
                <th>{t('pages.results.village')}</th>
                <th>{t('pages.results.contact')}</th>
                        <th>{t('common.view')}</th>
                {isAdmin && <th>{t('common.actions')}</th>}
              </tr>
            </thead>
            <tbody>
                      {group.results.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className={styles.emptyCell}>
                            {t('tables.noRecords')}
                  </td>
                </tr>
              ) : (
                        group.results.map((result: any) => {
                          // Handle village name - could be object or string
                          const villageName =
                            typeof result.villageId === 'object'
                              ? result.villageId?.villageName
                              : '-';

                          const imageUrl = getImageUrl(result);

                          return (
                    <tr key={result._id}>
                              <td>{result.rank || '-'}</td>
                      <td>{result.studentName}</td>
                      <td>{result.percentage.toFixed(2)}%</td>
                              <td>{villageName || '-'}</td>
                      <td>{result.contactNumber || '-'}</td>
                              <td>
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt="Result"
                                    className={styles.resultThumbnail}
                                    onClick={() => handleImageClick(imageUrl)}
                                  />
                                ) : (
                                  '-'
                                )}
                              </td>
                      {isAdmin && (
                        <td>
                                  <div className={styles.rowActions}>
                                    <Button
                                      variant="primary"
                                      size="small"
                                      onClick={() => handleEditClick(result._id)}
                                    >
                                      {t('common.edit')}
                                    </Button>
                          <Button
                            variant="danger"
                            size="small"
                            onClick={() => handleDelete(result._id)}
                          >
                            {t('common.delete')}
                          </Button>
                                  </div>
                        </td>
                      )}
                    </tr>
                          );
                        })
              )}
            </tbody>
          </table>
        </div>
              ))
            )}
          </div>
        )}

        {fullImageUrl && (
          <div className={styles.imageModalOverlay} onClick={() => setFullImageUrl(null)}>
            <div
              className={styles.imageModalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeImageButton}
                onClick={() => setFullImageUrl(null)}
              >
                ×
              </button>
              <img src={fullImageUrl} alt="Result" className={styles.fullSizeImage} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TopThreeRankingPage;
