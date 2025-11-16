import React from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import Layout from '../../components/layout/Layout';
import styles from './EventInformationPage.module.css';

const EventInformationPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className={styles.eventPage}>
        <h1 className={styles.title}>{t('navigation.eventInfo')}</h1>
        
        <div className={styles.content}>
          <section className={styles.section}>
            <h2>ગૌદાની પરિવાર કાર્યક્રમ</h2>
            <p>
              ગૌદાની પરિવારના વાર્ષિક કાર્યક્રમમાં વિધાર્થીઓના પરિણામોની જાહેરાત અને પુરસ્કાર વિતરણ કરવામાં આવે છે.
            </p>
          </section>

          <section className={styles.section}>
            <h2>કાર્યક્રમની સમયપત્રક</h2>
            <ul className={styles.schedule}>
              <li>સમય: દર વર્ષે ડિસેમ્બર મહિનામાં</li>
              <li>સ્થળ: ગૌદાની પરિવાર સમાજ હોલ</li>
              <li>કાર્યક્રમ: પરિણામ જાહેરાત અને પુરસ્કાર વિતરણ</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>પુરસ્કાર વર્ગો</h2>
            <div className={styles.awards}>
              <div className={styles.awardCard}>
                <h3>પ્રથમ સ્થાન</h3>
                <p>દરેક ધોરણ/ડિગ્રીમાં પ્રથમ સ્થાન મેળવનાર વિધાર્થીઓને પુરસ્કાર</p>
              </div>
              <div className={styles.awardCard}>
                <h3>દ્વિતીય સ્થાન</h3>
                <p>દરેક ધોરણ/ડિગ્રીમાં દ્વિતીય સ્થાન મેળવનાર વિધાર્થીઓને પુરસ્કાર</p>
              </div>
              <div className={styles.awardCard}>
                <h3>તૃતીય સ્થાન</h3>
                <p>દરેક ધોરણ/ડિગ્રીમાં તૃતીય સ્થાન મેળવનાર વિધાર્થીઓને પુરસ્કાર</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>સંપર્ક માહિતી</h2>
            <div className={styles.contact}>
              <p><strong>ગૌદાની પરિવાર સમિતિ</strong></p>
              <p>કોઈ પણ પ્રશ્ન અથવા માહિતી માટે કૃપા કરીને સંપર્ક કરો.</p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>કાર્યક્રમનો ઇતિહાસ</h2>
            <p>
              ગૌદાની પરિવાર દ્વારા દર વર્ષે વિધાર્થીઓના પરિણામોની જાહેરાત અને પુરસ્કાર વિતરણનો કાર્યક્રમ આયોજિત કરવામાં આવે છે.
              આ કાર્યક્રમ દ્વારા વિધાર્થીઓને તેમની સફળતા માટે પ્રોત્સાહન અને પુરસ્કાર આપવામાં આવે છે.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default EventInformationPage;

