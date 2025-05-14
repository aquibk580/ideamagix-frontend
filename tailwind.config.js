// tailwind.config.js
import daisyui from "daisyui"; // Ensure you're importing the plugin

export default {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}", // Include paths to your files
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui], // Add DaisyUI plugin here
};
