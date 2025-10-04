import React from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";

class IdentificationCard extends React.Component {
    generatePDF = () => {
        const name = "نور";
        const lastName = "موسى";
        const identificationId = "12846030";
        //const pdf = new jsPDF('l', 'mm', 'a8');
        const AmiriRegular = "AAEAAAASAQAABAAgRFNJR2D2zXQA.....A";
        const pdf = new jsPDF("l", "mm", "a8", { filters: ["ASCIIHexEncode"] });
        pdf.addFileToVFS("Amiri-Regular.ttf", AmiriRegular);
        pdf.addFont("Amiri-Regular.ttf", "Amiri", "normal");

        pdf.setFont("Amiri");
        pdf.text(`الاسم: ${name}`, 10, 15);
        pdf.text(`اللقب: ${lastName}`, 10, 20);
        pdf.text(`المعرف: ${identificationId}`, 10, 25);

        pdf.save("IdentificationCard.pdf");
    };
    render() {
        return (
            <div>
                <button onClick={this.generatePDF}>generate pdf</button>
            </div>
        );
    }
}

export default IdentificationCard;
