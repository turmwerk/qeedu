import React from "react";
import { Navigate, useParams } from "react-router-dom";

type Props = {
  to: (params: Readonly<Record<string, string | undefined>>) => string;
};

const LegacyParamRedirect: React.FC<Props> = ({ to }) => {
  const params = useParams();
  return <Navigate to={to(params)} replace />;
};

export default LegacyParamRedirect;
