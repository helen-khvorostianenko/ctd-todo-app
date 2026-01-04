function TextInputWithLabel({ elementId, label,  ref, value, onChange}) {
  return (
    <>
      <label htmlFor={elementId}>{label}</label>
      <input
        type="text"
        id={elementId}
        name="title"
        placeholder="add a title"
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel;