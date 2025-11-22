import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button/Button';
import { adminApi } from '../../services/api/adminApi';
import styles from './HomePage.module.css';

interface Countdown {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

const HomePage: React.FC = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
  const [deadlineEndOfDay, setDeadlineEndOfDay] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState<Countdown>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });
  const [hasDeadline, setHasDeadline] = useState(false);
  const [isDeadlineExpired, setIsDeadlineExpired] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [hasReadInstructions, setHasReadInstructions] = useState(false);

  const formatDate = useMemo(() => {
    const locale = language === 'gu' ? 'gu-IN' : 'en-IN';
    return (date: Date) =>
      new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
  }, [language]);

  useEffect(() => {
    let mounted = true;
    const fetchSettings = async () => {
      try {
        const data = await adminApi.getSettingsPublic();
        if (!mounted) return;
        if (data.lastDateToUploadResult) {
          const displayDate = new Date(data.lastDateToUploadResult);
          const endOfDay = new Date(data.lastDateToUploadResult);
          endOfDay.setHours(23, 59, 59, 999);
          setDeadlineDate(displayDate);
          setDeadlineEndOfDay(endOfDay);
          setHasDeadline(true);
          const now = new Date();
          if (now > endOfDay) {
            setIsDeadlineExpired(true);
            setIsCountdownActive(false);
          } else {
            setIsDeadlineExpired(false);
            setIsCountdownActive(true);
            updateCountdown(endOfDay);
          }
        } else {
          setHasDeadline(false);
        }
      } catch (error) {
        setHasDeadline(false);
      }
    };
    fetchSettings();
    return () => {
      mounted = false;
    };
  }, []);

  const updateCountdown = (targetDate: Date) => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance <= 0) {
      setIsDeadlineExpired(true);
      setIsCountdownActive(false);
      setCountdown({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
      });
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setCountdown({
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    });
  };

  useEffect(() => {
    if (!deadlineEndOfDay || !isCountdownActive) return;
    updateCountdown(deadlineEndOfDay);
    const interval = setInterval(() => {
      updateCountdown(deadlineEndOfDay);
    }, 1000);
    return () => clearInterval(interval);
  }, [deadlineEndOfDay, isCountdownActive]);

  return (
    <Layout>
      <div className={styles.homePage}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>{t('pages.home.title')}</h1>
          <div className={styles.kuldevi}>
            || કુળદેવી આઈ શ્રી ખોડીયાર માતાજી ||
          </div>
          <p className={styles.welcome}>{t('pages.home.welcome')}</p>
        </div>

        {hasDeadline && deadlineDate && (
          <div className={styles.deadlineCard}>
            <div className={styles.deadlineHeader}>
              <h3>{t('pages.home.deadlineTitle')}</h3>
              <p className={styles.deadlineDate}>
                {t('pages.home.deadlineDateLabel')}: {formatDate(deadlineDate)}
              </p>
            </div>
            {!isDeadlineExpired ? (
              <>
                <p className={styles.deadlineDescription}>
                  {t('pages.home.deadlineDescription')}
                </p>
                <div className={styles.countdownWrapper}>
                  <div className={styles.countdownLabel}>{t('pages.home.countdownLabel')}</div>
                  <div className={styles.countdown}>
                    <div className={styles.countdownItem}>
                      <span>{countdown.days}</span>
                      <small>{t('pages.home.countdown.days')}</small>
                    </div>
                    <div className={styles.countdownItem}>
                      <span>{countdown.hours}</span>
                      <small>{t('pages.home.countdown.hours')}</small>
                    </div>
                    <div className={styles.countdownItem}>
                      <span>{countdown.minutes}</span>
                      <small>{t('pages.home.countdown.minutes')}</small>
                    </div>
                    <div className={styles.countdownItem}>
                      <span>{countdown.seconds}</span>
                      <small>{t('pages.home.countdown.seconds')}</small>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.deadlineExpired}>
                {t('pages.home.deadlineExpired')}
              </div>
            )}
          </div>
        )}

        <div className={styles.importantInstructionsSection}>
          <h2 className={styles.importantInstructionsTitle}>
            {t('pages.home.importantInstructionsTitle')}
          </h2>
          
          <div className={styles.instructionsGrid}>
            <div className={styles.instructionCard}>
              <h3 className={styles.instructionCardTitle}>
                {t('pages.home.eligibility.title')}
              </h3>
              <p className={styles.instructionCardText}>
                {t('pages.home.eligibility.description')}
              </p>
            </div>

            <div className={styles.instructionCard}>
              <h3 className={styles.instructionCardTitle}>
                {t('pages.home.deadlineInfo.title')}
              </h3>
              <p className={styles.instructionCardText}>
                {t('pages.home.deadlineInfo.description')}
              </p>
            </div>

            <div className={styles.instructionCard}>
              <h3 className={styles.instructionCardTitle}>
                {t('pages.home.examYear.title')}
              </h3>
              <p className={styles.instructionCardText}>
                {t('pages.home.examYear.description')}
              </p>
            </div>

            <div className={styles.instructionCard}>
              <h3 className={styles.instructionCardTitle}>
                {t('pages.home.photoUpload.title')}
              </h3>
              <p className={styles.instructionCardText}>
                {t('pages.home.photoUpload.description')}
              </p>
              <ul className={styles.instructionList}>
                <li>{t('pages.home.photoUpload.point1')}</li>
                <li>{t('pages.home.photoUpload.point2')}</li>
              </ul>
              <p className={styles.instructionNote}>
                {t('pages.home.photoUpload.note')}
              </p>
            </div>

            <div className={styles.instructionCard}>
              <h3 className={styles.instructionCardTitle}>
                {t('pages.home.standardInfo.title')}
              </h3>
              <p className={styles.instructionCardText}>
                {t('pages.home.standardInfo.description')}
              </p>
            </div>

            <div className={styles.instructionCard}>
              <h3 className={styles.instructionCardTitle}>
                {t('pages.home.formRules.title')}
              </h3>
              <p className={styles.instructionCardText}>
                {t('pages.home.formRules.description')}
              </p>
            </div>

            <div className={styles.instructionCard}>
              <h3 className={styles.instructionCardTitle}>
                {t('pages.home.viewResults.title')}
              </h3>
              <p className={styles.instructionCardText}>
                {t('pages.home.viewResults.description')}
              </p>
              <ul className={styles.instructionList}>
                <li>{t('pages.home.viewResults.point1')}</li>
                <li>{t('pages.home.viewResults.point2')}</li>
                <li>{t('pages.home.viewResults.point3')}</li>
              </ul>
            </div>

            <div className={styles.instructionCard}>
              <h3 className={styles.instructionCardTitle}>
                {t('pages.home.resultGraph.title')}
              </h3>
              <p className={styles.instructionCardText}>
                {t('pages.home.resultGraph.description')}
              </p>
            </div>

            <div className={styles.instructionCard}>
              <h3 className={styles.instructionCardTitle}>
                {t('pages.home.incompleteResults.title')}
              </h3>
              <p className={styles.instructionCardText}>
                {t('pages.home.incompleteResults.description')}
              </p>
            </div>
          </div>

          <div className={styles.finalChecklistCard}>
            <h3 className={styles.finalChecklistTitle}>
              {t('pages.home.finalChecklist.title')}
            </h3>
            <ul className={styles.checklistList}>
              <li>{t('pages.home.finalChecklist.point1')}</li>
              <li>{t('pages.home.finalChecklist.point2')}</li>
              <li>{t('pages.home.finalChecklist.point3')}</li>
            </ul>
          </div>
        </div>

        <div className={styles.instructionsSection}>
          <h2 className={styles.instructionsTitle}>{t('pages.home.instructionsTitle')}</h2>
          <p className={styles.instructionsParagraph}>{t('pages.home.instructionsParagraph')}</p>
        </div>

        <div className={styles.actionsSection}>
          <div className={styles.checkboxWrapper}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={hasReadInstructions}
                onChange={(e) => setHasReadInstructions(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                {t('pages.home.readInstructionsCheckbox')}
              </span>
            </label>
          </div>
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate('/upload-result')}
            disabled={!hasReadInstructions}
          >
            {t('pages.home.uploadResult')}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

