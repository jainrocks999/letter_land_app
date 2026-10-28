import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import CustomButton from '../../customButton/CustomButton';

interface ParentGateProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const createQuestion = () => {
  const a = Math.floor(Math.random() * 6) + 4;
  const b = Math.floor(Math.random() * 6) + 3;
  const answer = a * b;
  const options = new Set<number>([answer]);
  while (options.size < 3) {
    options.add(answer + (Math.floor(Math.random() * 9) - 4 || 5));
  }
  return {
    text: `${a} × ${b}`,
    answer,
    options: [...options].sort(() => Math.random() - 0.5),
  };
};

// a simple multiplication check so kids can't wipe their progress by accident
const ParentGate: React.FC<ParentGateProps> = ({ onConfirm, onCancel }) => {
  const [question, setQuestion] = useState(createQuestion);
  const [isWrong, setIsWrong] = useState(false);
  const shakeX = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handleAnswer = (option: number) => {
    if (option === question.answer) {
      onConfirm();
      return;
    }
    setIsWrong(true);
    shakeX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-6, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
    setQuestion(createQuestion());
  };

  return (
    <Animated.View entering={FadeIn.duration(250)} style={styles.container}>
      <Text style={styles.title}>👨‍👩‍👧 Grown-ups only</Text>
      <Text style={styles.message}>
        This will erase all stars, stickers, trophies and progress. Solve this
        to continue:
      </Text>

      <Animated.View style={[styles.questionBox, shakeStyle]}>
        <Text style={styles.question}>{question.text} = ?</Text>
      </Animated.View>
      {isWrong && <Text style={styles.wrongText}>Oops! Try again.</Text>}

      <View style={styles.optionsRow}>
        {question.options.map(option => (
          <TouchableOpacity
            key={option}
            style={styles.option}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <CustomButton
        width={'100%'}
        bottomBorderColor="#b5b5b5"
        colors={['#eeeeee', '#e2e2e2']}
        onPress={onCancel}
        padding={12}
        paddingBottom={7}
        btnRadius={15}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </CustomButton>
    </Animated.View>
  );
};

export default ParentGate;

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 12 },
  title: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 24,
    color: '#1a105f',
  },
  message: {
    fontFamily: 'Fredoka-Medium',
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  questionBox: {
    backgroundColor: '#f6e7c8',
    borderColor: '#d9a441',
    borderWidth: 2,
    borderBottomWidth: 6,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  question: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 32,
    color: '#7a4a00',
  },
  wrongText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 14,
    color: '#EF4444',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#7b61ff',
    borderWidth: 2,
    borderBottomWidth: 6,
    borderRadius: 15,
    paddingVertical: 12,
  },
  optionText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 22,
    color: '#7b61ff',
  },
  cancelText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Fredoka-Bold',
    fontSize: 16,
    color: '#777',
  },
});
