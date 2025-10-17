export default function SessionPage({
  params,
}: {
  params: { session_id: string };
}) {
  return <div>Session ID: {params.session_id}</div>;
}
