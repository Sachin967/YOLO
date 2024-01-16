const Page404 = () => {
  return <div className="sec"><div className="wrap">
    <video className="video" poster="https://knife.media/wp-content/themes/knife/assets/images/poster-error.jpg" autoplay preload loop muted>
      <source src="https://knife.media/wp-content/themes/knife/assets/video/video-error.mp4" type="video/mp4" />
    </video>

    <div className="message">
      <h1>Nothing found</h1>
      <p>Better go to the <a href="https://knife.media/" target="_blank">main page</a><br/> and read something fresh.</p>
    </div>
  </div></div>
};
export default Page404;


