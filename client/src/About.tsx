import './About.css';

export default function About() {
  
  const teamMembers = [
    {
      name: "Shahriar Mahir",
      id: "20230104114",
      sec: "C1",
      image: "https://placehold.co/300x400/1e293b/F4A261?text=Mahir" 
    },
    {
      name: "MD Fahim Imam",
      id: "20230104107",
      sec: "C1",
      image: "https://placehold.co/300x400/1e293b/F4A261?text=Fahim"
    },
    {
      name: "Jaliz Mahmud Mridul",
      id: "20230104112",
      sec: "C1",
      image: "https://placehold.co/300x400/1e293b/F4A261?text=Jaliz"
    },
    {
      name: "Partha Protim Biswas",
      id: "20230104109",
      sec: "C1",
      image: "https://placehold.co/300x400/1e293b/F4A261?text=Partha"
    }
  ];

  return (
    <div className="about-page-container">
      <div className="about-hero-section">
        <h1>About AlumniConnect</h1>
        <p>Empowering graduates to connect, grow, and succeed together beyond the university campus.</p>
      </div>

      <div className="about-content-grid">
        <div className="about-info-card">
          <h2>Our Mission</h2>
          <p>We believe in the power of community. AlumniConnect was built to ensure that graduation is not the end of your university journey, but the beginning of a lifelong network of support, mentorship, and opportunity. We strive to bridge the gap between experienced professionals and fresh graduates.</p>
        </div>

        <div className="about-info-card">
          <h2>What We Offer</h2>
          <ul className="about-feature-list">
            <li><strong>Mentorship:</strong> Connect with industry leaders.</li>
            <li><strong>Career Growth:</strong> Access exclusive job and internship postings.</li>
            <li><strong>Networking:</strong> Engage in meaningful discussions with peers.</li>
            <li><strong>Events:</strong> Participate in webinars, reunions, and workshops.</li>
          </ul>
        </div>
      </div>

      <div className="about-team-section">
        <div className="team-header">
          <h2 className="team-title">Meet The Team</h2>
        </div>
        
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-card" key={index}>
              <img src={member.image} alt={member.name} className="team-avatar" />
              <h3 className="team-name">{member.name}</h3>
              <p className="team-details">
                ID : {member.id}<br />
                Sec : {member.sec}
              </p>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}