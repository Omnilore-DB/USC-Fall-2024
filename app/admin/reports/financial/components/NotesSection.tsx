import React from "react";

interface NotesSectionProps {
  title?: string;
  notes: string[];
}

const NotesSection: React.FC<NotesSectionProps> = ({
  title = "Notes",
  notes,
}) => {
  return (
    <div style={{ marginTop: "40px" }}>
      <h3>{title}</h3>
      <ul style={{ paddingLeft: "20px" }}>
        {notes.map((note, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesSection;
