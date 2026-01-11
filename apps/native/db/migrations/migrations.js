// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_busy_korg.sql';
import m0001 from './0001_useful_wolfsbane.sql';
import m0002 from './0002_glamorous_ricochet.sql';
import m0003 from './0003_daily_dazzler.sql';
import m0004 from './0004_careful_celestials.sql';
import m0005 from './0005_worried_anthem.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005
    }
  }
  