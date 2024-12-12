import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import * as SQLite from 'expo-sqlite';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const db = SQLite.openDatabase('myDatabase.db');

  useEffect(() => {
    // Create table if it doesn't exist
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS calculations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          expression TEXT NOT NULL,
          result TEXT NOT NULL,
          timestamp TEXT NOT NULL
        )`,
        [],
        () => {
          console.log('Table created or already exists');
          fetchHistory();
        },
        (_, error) => {
          console.error('Error creating table:', error);
          return false;
        }
      );
    });
  }, []);

  const fetchHistory = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM calculations ORDER BY timestamp DESC',
        [],
        (_, { rows }) => {
          const items = [];
          for (let i = 0; i < rows.length; i++) {
            items.push(rows.item(i));
          }
          setHistory(items);
        },
        (_, error) => {
          console.error('Error fetching history:', error);
          return false;
        }
      );
    });
  };

  const deleteHistoryItem = (id) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM calculations WHERE id = ?',
        [id],
        () => fetchHistory(),
        (_, error) => {
          console.error('Error deleting history item:', error);
          return false;
        }
      );
    });
  };

  const clearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all calculation history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          onPress: () => {
            db.transaction(tx => {
              tx.executeSql(
                'DELETE FROM calculations',
                [],
                () => setHistory([]),
                (_, error) => {
                  console.error('Error clearing history:', error);
                  return false;
                }
              );
            });
          } 
        },
      ]
    );
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyContent}>
        <Text style={styles.historyExpression}>{item.expression}</Text>
        <Text style={styles.historyResult}>= {item.result}</Text>
        <Text style={styles.historyTimestamp}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteHistoryItem(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {history.length === 0 ? (
        <Text style={styles.emptyText}>No calculation history</Text>
      ) : (
        <>
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id.toString()}
          />
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearHistory}
          >
            <Text style={styles.clearButtonText}>Clear History</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  historyContent: {
    flex: 1,
  },
  historyExpression: {
    fontSize: 18,
    color: '#333',
  },
  historyResult: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  historyTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#666',
  },
  clearButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;
