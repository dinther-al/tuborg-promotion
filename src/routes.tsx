import React, { Suspense, lazy } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import RecoilNexus from 'recoil-nexus'
import { AnimationRoutes, App, SnackbarProvider, ZMPRouter } from 'zmp-ui'
import ResultPage from './pages/resultPage'
// import { GlobalDialog } from './components/Global/dialog'
// import HomePage from './pages/homePage'
// import ReceiveGift from './pages/receiveGift'
// import QrInvalid from './pages/qrInvalid'
// import QrInvalid2 from './pages/qrInvalid2'
const Fallback = lazy(() => import("./modules/widget/fallbackRender"));
const SkeletonPage = lazy(() => import("./modules/widget/skeleton"));
const Restriction = lazy(() => import("./modules/widget/restriction"));
const CheckInternet = lazy(() => import("./modules/widget/checkInternet"));
const Dialog = lazy(() => import("./modules/widget/dialog"));

const HomePage = lazy(() => import("./pages/homePage"));

const MyApp = () => {
  const a = 1;
  return (
    <RecoilRoot>
      <RecoilNexus />
      <ZMPRouter>
        <Suspense fallback={<SkeletonPage />}>
          <App>
            <ErrorBoundary FallbackComponent={Fallback}>
              <SnackbarProvider>
                {/* <Welcome/> */}
                <AnimationRoutes>
                  {/* <Route path='/' element={<HomePage />}></Route> */}
                  <Route path='/' element={<ResultPage />}></Route>
                </AnimationRoutes>
              </SnackbarProvider>
            </ErrorBoundary>
            <Dialog />
            <CheckInternet />
            {/* <LowNetWorkComponent /> */}
            <Restriction />
          </App>
        </Suspense>
      </ZMPRouter>
    </RecoilRoot>
  )
}
export default MyApp
