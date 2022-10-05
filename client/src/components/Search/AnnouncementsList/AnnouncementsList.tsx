import styles from './AnnouncementList.module.scss'
import { Announcement } from '../../../shared/types'
import AnnouncementCard from './AnnouncementCard/AnnouncementCard'

type Props = {
   announcements: Announcement[]
   announcementsLoading: boolean
}

const AnnouncementsList = ({ announcements, announcementsLoading }: Props) => {
   return (
      <div className={styles.container}>
         {announcementsLoading && <div className={styles.overlay} />}
         {announcements.map(a => (
            <AnnouncementCard key={a._id} a={a} />
         ))}
      </div>
   )
}

export default AnnouncementsList
