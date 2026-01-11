import FeedbackForm from "./FeedbackForm";

export default function Feedback() {
  return (
    <section className="mx-auto flex w-[768px] flex-col gap-10 p-10">
      <div className="rounded-md border border-green-300 p-3 shadow-md">
        <div className="p-3 text-left text-2xl text-black">Feedback</div>
        <div className="w-full bg-white p-10">
          <FeedbackForm />
        </div>
      </div>
    </section>
  );
}
