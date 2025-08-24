import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const fixedColors = [
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#00FFFF",
  "#FF00FF",
  "#FF0000",
  "#C0C0C0", // existing colors
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#800080",
  "#008080",
  "#808080", // darker versions of the existing colors
  "#FFA500",
  "#A52A2A",
  "#8B008B",
  "#556B2F",
  "#FF4500",
  "#2E8B57",
  "#ADFF2F", // some more colors
  "#F08080",
  "#E0FFFF",
  "#FAFAD2",
  "#D3D3D3",
  "#90EE90",
  "#FFB6C1",
  "#FFA07A", // light colors
  "#20B2AA",
  "#87CEFA",
  "#778899",
  "#B0C4DE",
  "#FFFFE0",
  "#00FF7F",
  "#32CD32", // mixed colors
  "#FAF0E6",
  "#FFD700",
  "#E6E6FA",
  "#FFF0F5",
  "#7CFC00",
  "#FFFACD",
  "#ADD8E6", // more mixed colors
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export const generateRandomColor = () => {
  // Generate a random hexadecimal color code
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

export const generateRandomColors = (numColors: any) => {
  // Generate an array of random colors
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    colors.push(generateRandomColor());
  }
  return colors;
};

export const getColors = (length: number) => {
  let colors = [];
  for (let i = 0; i < length; i++) {
    colors.push(fixedColors[i % fixedColors.length]);
  }
  return colors;
};
