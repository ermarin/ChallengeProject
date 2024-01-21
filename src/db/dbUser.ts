import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';

enablePromise(true);

interface TypeUser {
  userName: string;
  userAge: number;
}

export const connectToDatabase = async () => {
  return openDatabase(
    { name: 'MainDB.db', location: 'default' },
    () => {},
    (error) => {
      console.log(error);
      throw Error('Could not connect to database');
    }
  )
}

export const createTable = async (db: SQLiteDatabase) => {
  const userQuery = `
    CREATE TABLE IF NOT EXISTS Users (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      Name TEXT,
      Age INTEGER
    );`

  try {
    await db.executeSql(userQuery)
  } catch (error) {
    console.log(error)
    throw Error('Failed to create tables')
  }
}


export const getTableUser = async (db: SQLiteDatabase) => {
  try {
    const tableUser: TypeUser = {
      userName: '',
      userAge: 0
    };

    const results: any = await db.executeSql('SELECT Name, Age FROM Users');
    results?.forEach((result: any) => {
      tableUser.userName = result?.rows?.item(0)?.Name;
      tableUser.userAge = result?.rows?.item(0)?.Age;
    })

    return tableUser
  } catch (error) {
    console.error(error);
    throw Error('Failed to get table user from database');
  }
}

export const setTableUser = async (db: SQLiteDatabase, user: any) => {
  const insertQuery = `
    INSERT INTO Users (Name, Age) VALUES (?,?)
  `;

  const values = [
    user.name,
    user.age,
  ];

  try {
    return db.executeSql(insertQuery, values);
  } catch (error) {
    console.error(error);
    throw Error('Failed to add user');
  }
}

export const deleteTableUser = async (db: SQLiteDatabase) => {
  const updateQuery = `DELETE FROM Users`;

  try {
    return db.executeSql(updateQuery);
  } catch(error) {
    console.error(error);
    throw Error('Failed to remove user');
  }
}
