const enquiryForm = document.querySelector('[data-enquiry-form]');

if (enquiryForm) {
  enquiryForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(enquiryForm);
    const name = data.get('name').trim();
    const phone = data.get('phone').trim() || 'Not provided';
    const email = data.get('email').trim() || 'Not provided';
    const message = data.get('message').trim();
    const enquiry = `New website enquiry\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nEnquiry:\n${message}`;

    if (event.submitter?.dataset.channel === 'whatsapp') {
      window.open(`https://wa.me/9779851206290?text=${encodeURIComponent(enquiry)}`, '_blank', 'noopener');
      return;
    }

    const subject = `Website enquiry from ${name}`;
    window.location.href = `mailto:hirakalabuildandconult@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(enquiry)}`;
  });
}
