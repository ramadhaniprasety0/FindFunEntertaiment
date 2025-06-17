import React, { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { API_URL_NEWS } from "../../api/axios";

const NewsComponent = () => {
    const [hotsNews, setHotsNews] = useState([]);

    const fetchNews = async () => {
        try {
            const response = await fetch(API_URL_NEWS);
            const data = await response.json();
            setHotsNews(data.articles.slice(0, 4)); 
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <>
            {hotsNews.map((hots, index) => (
                <Col lg={12} key={index} className="mb-4">
                    <div className="news-card d-flex">
                        <img src={hots.urlToImage} alt="NewsBrand" className="img-brand" />
                        <div className="news-caption d-flex flex-column justify-content-between">
                            <div>
                                <h5>{hots.title}</h5>
                                <p>{hots.description}</p>
                                <a href={hots.url} target="_blank" rel="noopener noreferrer">Lihat Lebih Banyak</a>
                            </div>
                            <p className="text-white">{new Date(hots.publishedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </Col>
            ))}
        </>
    );
};

export default NewsComponent;
