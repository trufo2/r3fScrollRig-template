const Home = () => {
    return (
        <div className="hero-section-a">
            <div className="hero-section-b disable-select relative z-30 bg-black/10 max-w-full mx-auto mt-20"
                style={{ 
                    height: 'auto',
                    padding: '1rem',
                    background: 'rgba(0, 0, 0, 0.1)',
                    width: '100%'
                }}>
                <p className="hero-section-c">
                    Hello, je suis Michael<span className="waving-hand">👋</span>
                </p>
                <p className="hero_tag hero-section-d">Bienvenue sur mon portfolio!</p>
            </div>
        </div>
    );
}

export default Home;
