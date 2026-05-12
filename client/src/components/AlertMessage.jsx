function AlertMessage({ error, message }) {
  return (
    <>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
    </>
  );
}

export default AlertMessage;