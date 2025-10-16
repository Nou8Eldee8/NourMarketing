import Header from "../components/header"; // use ../ if the page is one folder deeper

export default function ReelMakerDashboard() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-gray-100">
          <Header />
          <p>Log completed shoots, number of videos, and delivery details.</p>
    </div>
  );
}
