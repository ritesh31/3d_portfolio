// TypeScript does not know how to handle file types like .glb
// So need to declare module for .glb files 
// This tells TypeScript that whenever it encounters an import from a .glb file, it should treat it as a string

declare module "*.glb" {
  const value: string; // Treat .glb files as a string (file path)
  export default value;
}
