interface EmptyStateProps {
  Icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
}
export default function Empty({
  Icon,
  title,
  description,
  buttonText,
  onPress,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <View className="mb-10 size-32 items-center justify-center rounded-full bg-slate-50">
        {Icon}
      </View>
      <Text className="mb-3 text-xl font-semibold">{title}</Text>
      <Text className="mb-3 text-center text-base text-neutral-600">
        {description}
      </Text>
      <Button onPress={onPress} variant="secondary" className="mb-7 w-60">
        {buttonText}
      </Button>
    </View>
  );
}

import React from "react";
import { Text, View } from "react-native";
import Button from "./Button";
import { IconNode } from "lucide-react-native";
// import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
// // npm install lucide-react-native
// // import { Book, Library } from 'lucide-react-native';

// const { width } = Dimensions.get('window');

// const EmptyState = ({
//   icon: Icon, // Lucide Icon 컴포넌트를 prop으로 받음
//   title,
//   description,
//   buttonText,
//   onPress,
//   secondaryButtonText,
//   onSecondaryPress
// }) => {
//   return (
//     <View style={styles.container}>
//       {/* 아이콘 영역 */}
//       <View style={styles.iconContainer}>
//         {/* 아이콘 컴포넌트가 전달되면 렌더링 */}
//         {Icon && <Icon size={64} color="#94A3B8" strokeWidth={1.5} />}
//       </View>

//       {/* 텍스트 영역 */}
//       <Text style={styles.title}>{title}</Text>
//       <Text style={styles.description}>
//         {description}
//       </Text>

//       {/* 메인 액션 버튼 */}
//       {buttonText && (
//         <TouchableOpacity
//           style={styles.button}
//           activeOpacity={0.8}
//           onPress={onPress}
//         >
//           <Text style={styles.buttonText}>{buttonText}</Text>
//         </TouchableOpacity>
//       )}

//       {/* 보조 액션 버튼 */}
//       {secondaryButtonText && (
//         <TouchableOpacity
//           style={styles.secondaryButton}
//           activeOpacity={0.6}
//           onPress={onSecondaryPress}
//         >
//           <Text style={styles.secondaryButtonText}>{secondaryButtonText}</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     backgroundColor: '#FFFFFF',
//   },
//   iconContainer: {
//     width: 160,
//     height: 160,
//     backgroundColor: '#F8FAFC', // slate-50
//     borderRadius: 80,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#0F172A', // slate-900
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   description: {
//     fontSize: 16,
//     color: '#64748B', // slate-500
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 32,
//     maxWidth: width * 0.7,
//   },
//   button: {
//     width: '100%',
//     maxWidth: 280,
//     backgroundColor: '#4F46E5', // indigo-600
//     paddingVertical: 16,
//     borderRadius: 16,
//     alignItems: 'center',
//     shadowColor: '#4F46E5',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   secondaryButton: {
//     marginTop: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//   },
//   secondaryButtonText: {
//     color: '#64748B', // slate-500
//     fontSize: 15,
//     fontWeight: '500',
//   },
// });

// export default EmptyState;
