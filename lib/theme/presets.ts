export interface ColorPreset {
  name: string;
  colors: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    background: string;
    foreground: string;
    border: string;
  };
}

export const colorPresets: ColorPreset[] = [
  { name: 'Amber Glow', colors: { primary: '#f59e0b', primaryForeground: '#000000', secondary: '#262626', secondaryForeground: '#e5e5e5', background: '#0a0a0a', foreground: '#f59e0b', border: '#333333' } },
  { name: 'Purple Haze', colors: { primary: '#a995c9', primaryForeground: '#1a1823', secondary: '#5a5370', secondaryForeground: '#e0ddef', background: '#1a1823', foreground: '#e0ddef', border: '#5a5370' } },
  { name: 'Golden Hour', colors: { primary: '#ffbe14', primaryForeground: '#000000', secondary: '#8a4515', secondaryForeground: '#f4f4dd', background: '#111111', foreground: '#ffbe14', border: '#8a4515' } },
  { name: 'Deep Ocean', colors: { primary: '#155dfc', primaryForeground: '#ffffff', secondary: '#27272a', secondaryForeground: '#fafafa', background: '#0a0a0a', foreground: '#ffffff', border: '#27272a' } },
  { name: 'Violet Dream', colors: { primary: '#8b5cf6', primaryForeground: '#ffffff', secondary: '#1e1b4b', secondaryForeground: '#e0e7ff', background: '#0f0f0f', foreground: '#e0e7ff', border: '#1e1b4b' } },
  { name: 'Sunset Beach', colors: { primary: '#fbe2a7', primaryForeground: '#12242e', secondary: '#e4a2b1', secondaryForeground: '#12242e', background: '#12242e', foreground: '#fbe2a7', border: '#4a4a4a' } },
  { name: 'Mint Fresh', colors: { primary: '#1DB954', primaryForeground: '#ffffff', secondary: '#191414', secondaryForeground: '#1DB954', background: '#121212', foreground: '#ffffff', border: '#282828' } },
  { name: 'Sky Blue', colors: { primary: '#4285F4', primaryForeground: '#ffffff', secondary: '#F4B400', secondaryForeground: '#000000', background: '#202124', foreground: '#e8eaed', border: '#3c4043' } },
  { name: 'Lavender Mist', colors: { primary: '#6366F1', primaryForeground: '#ffffff', secondary: '#312E81', secondaryForeground: '#E0E7FF', background: '#1e1b4b', foreground: '#e0e7ff', border: '#4c4b7d' } },
  { name: 'Cosmic Purple', colors: { primary: '#5865F2', primaryForeground: '#ffffff', secondary: '#2C2F33', secondaryForeground: '#ffffff', background: '#36393f', foreground: '#dcddde', border: '#40444b' } },
  { name: 'Royal Velvet', colors: { primary: '#635BFF', primaryForeground: '#ffffff', secondary: '#F6F9FC', secondaryForeground: '#32325D', background: '#0a0a0a', foreground: '#ffffff', border: '#333333' } },
  { name: 'Midnight Black', colors: { primary: '#000000', primaryForeground: '#ffffff', secondary: '#ffffff', secondaryForeground: '#000000', background: '#191919', foreground: '#e6e6e5', border: '#373737' } },
  { name: 'Periwinkle', colors: { primary: '#5E6AD2', primaryForeground: '#ffffff', secondary: '#F4F5F7', secondaryForeground: '#171B26', background: '#0e0e0e', foreground: '#ffffff', border: '#2a2a2a' } },
  { name: 'Pure Noir', colors: { primary: '#000000', primaryForeground: '#ffffff', secondary: '#FAFAFA', secondaryForeground: '#000000', background: '#000000', foreground: '#ffffff', border: '#333333' } },
  { name: 'Forest Green', colors: { primary: '#238636', primaryForeground: '#ffffff', secondary: '#0D1117', secondaryForeground: '#C9D1D9', background: '#0d1117', foreground: '#c9d1d9', border: '#30363d' } },
  { name: 'Plum Wine', colors: { primary: '#4A154B', primaryForeground: '#ffffff', secondary: '#F4EDE4', secondaryForeground: '#1D1C1D', background: '#1a1d21', foreground: '#d1d2d3', border: '#565856' } },
  { name: 'Electric Blue', colors: { primary: '#1DA1F2', primaryForeground: '#ffffff', secondary: '#14171A', secondaryForeground: '#ffffff', background: '#000000', foreground: '#ffffff', border: '#2f3336' } },
  { name: 'Bubblegum', colors: { primary: '#E1306C', primaryForeground: '#ffffff', secondary: '#405DE6', secondaryForeground: '#ffffff', background: '#000000', foreground: '#ffffff', border: '#262626' } },
  { name: 'Crimson Night', colors: { primary: '#E50914', primaryForeground: '#ffffff', secondary: '#141414', secondaryForeground: '#ffffff', background: '#141414', foreground: '#ffffff', border: '#222222' } },
  { name: 'Cherry Red', colors: { primary: '#FF0000', primaryForeground: '#ffffff', secondary: '#282828', secondaryForeground: '#ffffff', background: '#0f0f0f', foreground: '#f1f1f1', border: '#303030' } },
  { name: 'Grape Soda', colors: { primary: '#9146FF', primaryForeground: '#ffffff', secondary: '#0E0E10', secondaryForeground: '#EFEFF1', background: '#0e0e10', foreground: '#efeff1', border: '#1f1f23' } },
  { name: 'Tangerine', colors: { primary: '#FF4500', primaryForeground: '#ffffff', secondary: '#1A1A1B', secondaryForeground: '#D7DADC', background: '#030303', foreground: '#d7dadc', border: '#343536' } },
  { name: 'Sapphire', colors: { primary: '#0077B5', primaryForeground: '#ffffff', secondary: '#F3F2EF', secondaryForeground: '#000000', background: '#000000', foreground: '#ffffff', border: '#38434f' } },
  { name: 'Cobalt Blue', colors: { primary: '#1877F2', primaryForeground: '#ffffff', secondary: '#F0F2F5', secondaryForeground: '#1C1E21', background: '#18191a', foreground: '#e4e6eb', border: '#3a3b3c' } },
  { name: 'Marigold', colors: { primary: '#FF9900', primaryForeground: '#000000', secondary: '#232F3E', secondaryForeground: '#ffffff', background: '#0f1111', foreground: '#ffffff', border: '#232f3e' } },
  { name: 'Azure', colors: { primary: '#0078D4', primaryForeground: '#ffffff', secondary: '#F3F2F1', secondaryForeground: '#323130', background: '#1e1e1e', foreground: '#d4d4d4', border: '#464647' } },
  { name: 'Shadow', colors: { primary: '#000000', primaryForeground: '#ffffff', secondary: '#F5F5F7', secondaryForeground: '#1D1D1F', background: '#000000', foreground: '#f5f5f7', border: '#38383d' } },
  { name: 'Coral Pink', colors: { primary: '#FF385C', primaryForeground: '#ffffff', secondary: '#F7F7F7', secondaryForeground: '#222222', background: '#000000', foreground: '#ffffff', border: '#484848' } },
  { name: 'Obsidian', colors: { primary: '#000000', primaryForeground: '#ffffff', secondary: '#F3F3F5', secondaryForeground: '#000000', background: '#000000', foreground: '#ffffff', border: '#333333' } },
  { name: 'Royal Blue', colors: { primary: '#0061FF', primaryForeground: '#ffffff', secondary: '#F7F5F2', secondaryForeground: '#1E1919', background: '#061e3c', foreground: '#ffffff', border: '#2c4b7c' } },
  { name: 'Ruby Red', colors: { primary: '#E60023', primaryForeground: '#ffffff', secondary: '#EFEFEF', secondaryForeground: '#111111', background: '#111111', foreground: '#efefef', border: '#2d2d2d' } },
  { name: 'Lemon Zest', colors: { primary: '#FFFC00', primaryForeground: '#000000', secondary: '#000000', secondaryForeground: '#ffffff', background: '#000000', foreground: '#ffffff', border: '#2a2a2a' } },
  { name: 'Hot Pink', colors: { primary: '#FF0050', primaryForeground: '#ffffff', secondary: '#000000', secondaryForeground: '#ffffff', background: '#000000', foreground: '#ffffff', border: '#2a2a2a' } },
  { name: 'Jade Green', colors: { primary: '#25D366', primaryForeground: '#ffffff', secondary: '#075E54', secondaryForeground: '#ffffff', background: '#111b21', foreground: '#e9edef', border: '#2a3942' } },
  { name: 'Steel Blue', colors: { primary: '#0088CC', primaryForeground: '#ffffff', secondary: '#F5F5F5', secondaryForeground: '#000000', background: '#0e1621', foreground: '#ffffff', border: '#242f3d' } },
  { name: 'Crystal Blue', colors: { primary: '#3A76F0', primaryForeground: '#ffffff', secondary: '#F6F6F6', secondaryForeground: '#1B1B1B', background: '#000000', foreground: '#ffffff', border: '#303030' } },
  { name: 'Flame Orange', colors: { primary: '#F24E1E', primaryForeground: '#ffffff', secondary: '#1E1E1E', secondaryForeground: '#ffffff', background: '#2c2c2c', foreground: '#ffffff', border: '#444444' } },
  { name: 'Blood Orange', colors: { primary: '#FF0000', primaryForeground: '#ffffff', secondary: '#2C2C2C', secondaryForeground: '#ffffff', background: '#252525', foreground: '#fafafa', border: '#3a3a3a' } },
  { name: 'Ocean Wave', colors: { primary: '#007ACC', primaryForeground: '#ffffff', secondary: '#1E1E1E', secondaryForeground: '#CCCCCC', background: '#1e1e1e', foreground: '#cccccc', border: '#3e3e3e' } },
  { name: 'Cyan Frost', colors: { primary: '#06B6D4', primaryForeground: '#ffffff', secondary: '#0F172A', secondaryForeground: '#E2E8F0', background: '#0f172a', foreground: '#e2e8f0', border: '#1e293b' } },
  { name: 'Monochrome', colors: { primary: '#000000', primaryForeground: '#ffffff', secondary: '#ffffff', secondaryForeground: '#000000', background: '#000000', foreground: '#ffffff', border: '#333333' } },
];
