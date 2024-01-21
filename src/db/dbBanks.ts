import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';

enablePromise(true);

interface TypeBank {
  bankName: string | null;
  description: string | null;
  url: string | null;
  age: number | null;
}

export const connectToDatabaseBanks = async () => {
  return openDatabase(
    { name: 'MainBankDB.db', location: 'default' },
    () => {},
    (error) => {
      console.log(error);
      throw Error('Could not connect to database');
    }
  )
}

export const createTableBanks = async (db: SQLiteDatabase) => {
  const banksQuery = `
    CREATE TABLE IF NOT EXISTS Banks (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      Age INTEGER,
      BankName TEXT,
      Description TEXT,
      Url TEXT
    );`

  try {
    await db.executeSql(banksQuery)
  } catch (error) {
    console.log(error)
    throw Error('Failed to create tables')
  }
}

export const getTableBanks = async (db: SQLiteDatabase) => {
  try {
    const tableBank: TypeBank = {
      bankName: null,
      description: null,
      url: null,
      age: null,
    };
    const results: any = await db.executeSql('SELECT Age, BankName, Description, Url FROM Banks');
    results?.map((i: any) => {
      tableBank.bankName = i.BankName;
      tableBank.description = i.Description;
      tableBank.url = i.Url;
      tableBank.age = i.Age;
    });
    return tableBank;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get table banks from database');
  }
}

export const setTableBanks = async (db: SQLiteDatabase, banks: any) => {
  const insertQuery = `
    INSERT OR REPLACE INTO Banks (
      Age, BankName, Description, Url)
      VALUES (?, ?, ?, ?)
  `;
  const values: any = banks;

  try {
    return db.executeSql(insertQuery, values);
  } catch (error) {
    console.error(error);
    throw Error('Failed to add banksList');
  }
}

export const updateTableBanks = async (db: SQLiteDatabase, bank: any) => {
  const updateQuery = `
    UPDATE Banks
    SET Age=?, BankName=?, Description=?, Url=?
  `;

  const values = [
    bank.age,
    bank.bankName,
    bank.description,
    bank.url,
  ];

  try {
    return db.executeSql(updateQuery, values);
  } catch (error) {
    console.error(error);
    throw Error('Failed to update banks');
  }
}

export const deleteTableBanks = async (db: SQLiteDatabase) => {
  const updateQuery = `DELETE FROM Banks`;

  try {
    return db.executeSql(updateQuery);
  } catch(error) {
    console.error(error);
    throw Error('Failed to remove banks');
  }
}
