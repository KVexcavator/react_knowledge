export default function Camera() {
  return (
    <div className="flex justify-center m-10">
      <img
        src="http://localhost:8002/video"
        alt="My camera stream"
        className="rounded-xl border border-blue-300 shadow-lg"
      />
    </div>
  );
}
