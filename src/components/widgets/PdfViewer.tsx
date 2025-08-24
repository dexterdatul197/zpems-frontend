import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

const PDFViewer = ({ pdfUrl, width, height }: any) => {
  return (
    <div className="">
      <Document file={pdfUrl}>
        <Page
          pageNumber={1}
          renderTextLayer={false}
          width={width}
          height={height}
        />
      </Document>
    </div>
  );
};
export default PDFViewer;
