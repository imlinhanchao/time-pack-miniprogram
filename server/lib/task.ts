import schedule from 'node-schedule';
import Capsule from '../interface/capsule';

export function create() {
  // 每天早上8点执行任务  
  schedule.scheduleJob(
    '0 0 8 * * *',
    async () => {
      try {
        await Capsule._notice(new Date().getTime());
      } catch (err) {
        console.error('Error in scheduled task:', err);
      }
    }
  );
}