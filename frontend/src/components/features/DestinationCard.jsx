const DestinationCard = ({ destination }) => {
  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_22px_70px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
      <img
        alt={destination.name}
        className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
        src={destination.image_url}
        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200'; }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.58))]" />
      <div className="absolute inset-x-5 bottom-5 text-white">
        <h4 className="font-['Fraunces'] text-2xl font-semibold tracking-[-0.04em]">{destination.name}</h4>
        <p className="mt-1 text-sm text-white/78">{destination.country}</p>
      </div>
    </article>
  );
};

export default DestinationCard;
