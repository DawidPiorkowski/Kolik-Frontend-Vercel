export default function ProtectedTest() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Protected Page</h1>
      <p className="text-gray-700">Only visible to logged-in users.</p>
    </div>
  );
}
// This component is a simple protected page that should only be accessible to logged-in users.