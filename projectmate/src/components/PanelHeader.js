function PanelHeader({ title, action, onClick }) {
  return (
    <div className="panel-header">
      <h2>{title}</h2>
      <button className="text-button" type="button" onClick={onClick}>
        {action}
      </button>
    </div>
  );
}

export default PanelHeader;
