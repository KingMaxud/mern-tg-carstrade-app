import styles from './AnnouncementList.module.scss'
import { Announcement } from '../../../shared/types'
import AnnouncementCard from './AnnouncementCard'

type Props = {
   announcements: Announcement[]
}

const AnnouncementsList = ({ announcements }: Props) => {
   return (
      <div className={styles.container}>
         {announcements.map(a => (
            <AnnouncementCard key={a._id} a={a} />
         ))}
      </div>
   )
}

export default AnnouncementsList
