export interface InputFieldProps  {
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: import("react-native").TextInputProps["keyboardType"];
  autoCapitalize?: import("react-native").TextInputProps["autoCapitalize"];
  value?: string;
  onChangeText?: (text: string) => void;
};

export interface PrimaryButtonProps {
  label?: string;
  onPress?: () => void;
  style?: any;
}

export interface LinkTextProps {
  text: string;
  highlight: string;
  href?: string; 
  onPress?: () => void;
}
