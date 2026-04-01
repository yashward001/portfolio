/* Terminal background grid — subtle green dot matrix */
export const SignatureGrid = () => (
  <div
    aria-hidden
    className="pointer-events-none fixed inset-0 -z-10"
    style={{
      backgroundImage:
        'radial-gradient(circle, rgba(0,255,65,0.06) 1px, transparent 1px)',
      backgroundSize: '40px 40px'
    }}
  />
);
