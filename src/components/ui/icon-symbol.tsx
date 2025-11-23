// src/components/ui/icon-symbol.tsx

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SFSymbol, SymbolView, SymbolViewProps } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, Platform, StyleProp, ViewStyle } from 'react-native';

// Bu dosya, iOS'teki SF Symbols ile Android'deki MaterialIcons arasında köprü kurar.
// Yeni bir ikon kullanacağında bu listeye ekleme yapmalısın.

const MAPPING = {
  // Alt Menü (Tab Bar) İkonları
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'person.fill': 'person',
  'gearshape.fill': 'settings',

  // Genel İkonlar
  'chevron.right': 'chevron-right',
  'arrow.left': 'arrow-back',
  'clock.fill': 'access-time',
  'car.fill': 'directions-car',
  'person.2.fill': 'group',
  'envelope.fill': 'email',
  'number.square.fill': 'confirmation-number',
  'bell.fill': 'notifications',
  'bell.slash.fill': 'notifications-off',
  'star.fill': 'star',
  'star': 'star-border',
  'checkmark.circle.fill': 'check-circle',
  'exclamationmark.triangle.fill': 'warning',
  'xmark.circle.fill': 'cancel',
  'rectangle.portrait.and.arrow.right': 'logout',

  // Sürücü Paneli İkonları (Yeni Eklenenler)
  'bubble.left.fill': 'chat-bubble', // Sohbet
  'checkmark': 'check',              // Tamamla (Tik)
  'xmark': 'close',                  // İptal (Çarpı)
} as Partial<
  Record<
    SFSymbol,
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolViewProps['weight'];
}) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        weight="medium"
        tintColor={color}
        resizeMode="scaleAspectFit"
        name={name}
        style={[
          {
            width: size,
            height: size,
          },
          style,
        ]}
      />
    );
  }

  // Android ve Web için MaterialIcons kullan
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}