import React from 'react';
import './Carousel.css';

interface Card {
  id: number;
  title: string;
  image: string;
  description: string;
}

interface CarouselProps {
  cards: Card[];
}

const Carousel: React.FC<CarouselProps> = ({ cards }) => {
  return (
    <div className="carousel-container">
      <div className="carousel-inner">
        {cards.map((card) => (
          <div key={card.id} className="carousel-card">
            <img src={card.image} alt={card.title} className="carousel-image" />
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
