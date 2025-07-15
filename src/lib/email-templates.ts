export const emailTemplates = {
  welcome: {
    subject: 'Your Prep Guide is Here ✅',
    html: `
      <div style="font-family: Georgia, serif; line-height: 1.6; color: #111;">
        <h1 style="color: #000;">Welcome!</h1>
        <p>Thanks for joining my list — here's your free editorial shoot prep guide:</p>
        <p><a href="{{prep_guide_url}}" target="_blank" style="color: #000; font-weight: bold;">👉 Download the Guide</a></p>
        <p>Can't wait to create something stunning with you.</p>
        <p>– Jeff<br/>
        <a href="https://jeffhonforlocophotos.com">jeffhonforlocophotos.com</a></p>
      </div>
    `
  },
  
  behindScenes: {
    subject: 'What really happens at a Jeff shoot...',
    html: `
      <div style="font-family: Georgia, serif; line-height: 1.6; color: #111;">
        <p>Here's a quick look behind the scenes of one of my recent editorial sessions 📸</p>
        <p>From concept to final delivery, I guide my clients through every step — posing, lighting, styling, and post-retouching.</p>
        <p>Curious what your shoot could look like?</p>
        <p><a href="https://jeffhonforlocophotos.com/contact" style="color: #000; font-weight: bold;">Let's make it happen → Book Now</a></p>
        <p>– Jeff</p>
      </div>
    `
  },
  
  bookingOffer: {
    subject: 'Let\'s build your story in images',
    html: `
      <div style="font-family: Georgia, serif; line-height: 1.6; color: #111;">
        <p>Whether you're a model, creator, or brand — your visuals define your presence.</p>
        <p>Let's create editorial images that feel like a cover shoot.</p>
        <p><a href="https://jeffhonforlocophotos.com/contact" style="color: #000; font-weight: bold;">💼 Book your slot → Book Now</a><br/>
        📅 Limited openings left this month</p>
        <p>I'd love to work with you.<br/>– Jeff</p>
      </div>
    `
  }
};

export const getEmailTemplate = (templateName: keyof typeof emailTemplates, variables: Record<string, string> = {}) => {
  const template = emailTemplates[templateName];
  if (!template) return null;
  
  let html = template.html;
  Object.entries(variables).forEach(([key, value]) => {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  
  return {
    subject: template.subject,
    html
  };
};