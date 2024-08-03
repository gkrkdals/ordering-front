export default function UpperBar() {
  return (
    <div
      className="bg-primary d-flex justify-content-center align-items-center"
      style={{
        position: 'sticky',
        top: 0,
        height: "45px",
      }}
    >
      <h5 className="m-0 text-light">ID1425</h5>
      <i
        className="bi bi-gear text-light position-absolute"
        style={{
          left: "90vw",
          fontSize: "19pt"
        }}
      />
    </div>
  )
}