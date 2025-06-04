export function Textarea({ ...props }) {
  return (
    <textarea
      className="w-full border rounded-lg p-2 text-gray-800"
      rows="4"
      {...props}
    />
  );
}