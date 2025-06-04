export function Button({ children, ...props }) {
  return (
    <button
      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow"
      {...props}
    >
      {children}
    </button>
  );
}