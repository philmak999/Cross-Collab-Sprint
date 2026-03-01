import "./PageFooter.scss";

function PageFooter({ isMenuOpen = false }) {
  return (
    <footer className={`page-footer${isMenuOpen ? " page-footer--menu-open" : ""}`}>
      <p className="page-footer__text">
        This information is confidential. Do not redistribute.
      </p>
    </footer>
  );
}

export default PageFooter;
