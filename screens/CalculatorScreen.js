import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from 'react-native';

const CalculatorScreen = ({ navigation }) => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputNumber = (number) => {
    if (waitingForSecondOperand) {
      setDisplay(String(number));
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? String(number) : display + number);
    }
  };

  const inputOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (firstOperand, secondOperand, operator) => {
    switch (operator) {
      case '+': return firstOperand + secondOperand;
      case '-': return firstOperand - secondOperand;
      case '*': return firstOperand * secondOperand;
      case '/': 
        if (secondOperand === 0) {
          Alert.alert('Error', 'Division by zero');
          return firstOperand;
        }
        return firstOperand / secondOperand;
      default: return secondOperand;
    }
  };

  const handleEqual = () => {
    if (operator && !waitingForSecondOperand) {
      const inputValue = parseFloat(display);
      const result = calculate(firstOperand, inputValue, operator);
      
      setDisplay(String(result));
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(true);
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
      </View>

      <TouchableOpacity 
        style={styles.historyButton} 
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.historyButtonText}>View History</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={clearDisplay}>
            <Text style={styles.buttonText}>C</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => inputOperator('/')}>
            <Text style={styles.buttonText}>÷</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          {[7, 8, 9].map(num => (
            <TouchableOpacity 
              key={num} 
              style={styles.button} 
              onPress={() => inputNumber(num)}
            >
              <Text style={styles.buttonText}>{num}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.button} onPress={() => inputOperator('*')}>
            <Text style={styles.buttonText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          {[4, 5, 6].map(num => (
            <TouchableOpacity 
              key={num} 
              style={styles.button} 
              onPress={() => inputNumber(num)}
            >
              <Text style={styles.buttonText}>{num}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.button} onPress={() => inputOperator('-')}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          {[1, 2, 3].map(num => (
            <TouchableOpacity 
              key={num} 
              style={styles.button} 
              onPress={() => inputNumber(num)}
            >
              <Text style={styles.buttonText}>{num}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.button} onPress={() => inputOperator('+')}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.zeroButton]} 
            onPress={() => inputNumber(0)}
          >
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleEqual}>
            <Text style={styles.buttonText}>=</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  },
  displayContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 20,
  },
  displayText: {
    color: 'white',
    fontSize: 80,
    fontWeight: '200',
  },
  historyButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 5,
  },
  historyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#333',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zeroButton: {
    width: 170,
  },
  buttonText: {
    color: 'white',
    fontSize: 35,
  },
});

export default CalculatorScreen;